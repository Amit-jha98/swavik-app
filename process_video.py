import cv2
import numpy as np
from rembg import remove
from rembg.session_factory import new_session
import time
import os
import subprocess

def process_video(input_path, output_path):
    print(f"Opening video: {input_path}")
    cap = cv2.VideoCapture(input_path)
    
    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    print(f"Video specs: {width}x{height} @ {fps}fps, {total_frames} total frames")
    
    # We will output as raw BGRA frames to stdout, and use ffmpeg to encode to webm vp9
    # This avoids moviepy/opencv encoding issues with alpha channels.
    
    ffmpeg_cmd = [
        'ffmpeg',
        '-y',  # Overwrite
        '-f', 'rawvideo',
        '-vcodec', 'rawvideo',
        '-s', f'{width}x{height}',
        '-pix_fmt', 'bgra',
        '-r', str(fps),
        '-i', '-',  # Input from stdin
        '-c:v', 'libvpx-vp9',
        '-pix_fmt', 'yuva420p',
        '-auto-alt-ref', '0',
        '-b:v', '2M',
        output_path
    ]
    
    print(f"Starting ffmpeg process: {' '.join(ffmpeg_cmd)}")
    ffmpeg_process = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE, stderr=subprocess.PIPE)
    
    session = new_session('u2net')
    
    frame_count = 0
    start_time = time.time()
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
                
            frame_count += 1
            
            # Convert BGR to RGB for rembg
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Process with rembg
            output = remove(rgb_frame, session=session, post_process_mask=True, bgcolor=(0,0,0,0))
            
            # Output is RGBA, we need BGRA for ffmpeg
            bgra_frame = cv2.cvtColor(output, cv2.COLOR_RGBA2BGRA)
            
            ffmpeg_process.stdin.write(bgra_frame.tobytes())
            
            if frame_count % 10 == 0:
                elapsed = time.time() - start_time
                fps_processing = frame_count / elapsed
                eta = (total_frames - frame_count) / fps_processing
                print(f"Processed {frame_count}/{total_frames} frames ({fps_processing:.1f} fps). ETA: {eta:.0f}s")
    
    except Exception as e:
        print(f"Error during processing: {e}")
        
    finally:
        cap.release()
        ffmpeg_process.stdin.close()
        ffmpeg_process.wait()
        print(f"Finished processing in {time.time() - start_time:.1f} seconds")

if __name__ == "__main__":
    input_file = "public/media/transperant_welcom_greating.mp4"
    output_file = "public/media/welcome_transparent_clean.webm"
    
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found")
    else:
        process_video(input_file, output_file)

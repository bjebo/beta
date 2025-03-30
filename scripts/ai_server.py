import cv2
import numpy as np
from flask import Flask, request, send_file
from werkzeug.utils import secure_filename
from io import BytesIO
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = './uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def process_image(file):
    # Read file into OpenCV image
    npimg = np.frombuffer(file.read(), np.uint8)
    original_image = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    if original_image is None:
        raise Exception("Could not decode image")

    final_image = original_image.copy()
    hsv = cv2.cvtColor(original_image, cv2.COLOR_BGR2HSV)

    # Pink holds
    lower_pink = np.array([160, 50, 50])
    upper_pink = np.array([175, 255, 255])
    mask_pink = cv2.inRange(hsv, lower_pink, upper_pink)
    contours_pink, _ = cv2.findContours(mask_pink, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    pink_boxes = []
    for contour in contours_pink:
        if cv2.contourArea(contour) > 500:
            x, y, w, h = cv2.boundingRect(contour)
            pink_boxes.append((x, y, w, h))
            cv2.rectangle(final_image, (x, y), (x + w, y + h), (0, 255, 0), 2)

    sorted_boxes = sorted(pink_boxes, key=lambda box: box[1] + box[3], reverse=True)
    for i in range(len(sorted_boxes) - 1):
        x1, y1, w1, h1 = sorted_boxes[i]
        x2, y2, w2, h2 = sorted_boxes[i + 1]
        start = (x1 + w1 // 2, y1 + h1 // 2)
        end = (x2 + w2 // 2, y2 + h2 // 2)
        cv2.arrowedLine(final_image, start, end, (255, 0, 0), 2, tipLength=0.05)

    # White holds
    lower_white = np.array([0, 0, 220])
    upper_white = np.array([180, 30, 255])
    mask_white = cv2.inRange(hsv, lower_white, upper_white)
    contours_white, _ = cv2.findContours(mask_white, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for contour in contours_white:
        if cv2.contourArea(contour) > 100:
            x, y, w, h = cv2.boundingRect(contour)
            cv2.rectangle(final_image, (x, y), (x + w, y + h), (0, 0, 255), 2)

    success, buffer = cv2.imencode('.jpg', final_image)
    if not success:
        raise Exception("Failed to encode processed image")
    return BytesIO(buffer.tobytes())

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return {'error': 'No image file provided'}, 400

    file = request.files['file']
    if file.filename == '':
        return {'error': 'Empty filename'}, 400

    try:
        processed_img_io = process_image(file)
        return send_file(processed_img_io, mimetype='image/jpeg')
    except Exception as e:
        return {'error': str(e)}, 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

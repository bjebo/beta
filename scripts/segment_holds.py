import cv2
import numpy as np

# Load the image of the climbing wall
image_path = 'assets/climbing_examples/climbing_wall.jpg'
image = cv2.imread(image_path)
if image is None:
    raise Exception("Image not found. Check the file path.")

# Convert image to HSV
hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

# ----------- Process Pink Holds & Draw Arrows (Your existing code) -----------
# Define HSV range for pink holds
lower_pink = np.array([150, 50, 50])
upper_pink = np.array([180, 255, 255])
mask_pink = cv2.inRange(hsv, lower_pink, upper_pink)

# Find contours in the pink mask
contours, hierarchy = cv2.findContours(mask_pink, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
bounding_boxes = []

for contour in contours:
    area = cv2.contourArea(contour)
    if area > 500:  # adjust threshold as needed
        x, y, w, h = cv2.boundingRect(contour)
        bounding_boxes.append((x, y, w, h))
        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)

# Sort bounding boxes by bottom coordinate (largest y+h first)
sorted_boxes = sorted(bounding_boxes, key=lambda box: box[1] + box[3], reverse=True)

# Draw arrows connecting the centers of each bounding box in sorted order
for i in range(len(sorted_boxes) - 1):
    x, y, w, h = sorted_boxes[i]
    start_point = (x + w // 2, y + h // 2)
    x2, y2, w2, h2 = sorted_boxes[i+1]
    end_point = (x2 + w2 // 2, y2 + h2 // 2)
    cv2.arrowedLine(image, start_point, end_point, (255, 0, 0), thickness=2, tipLength=0.05)

# Show the result of pink processing
cv2.imshow('Pink Holds with Arrows', image)
cv2.waitKey(0)
cv2.destroyAllWindows()

# ----------- Process White Areas -----------
# Work on a fresh copy of the original image
image_white = cv2.imread(image_path)
hsv_white = cv2.cvtColor(image_white, cv2.COLOR_BGR2HSV)

# Adjusted thresholds for white:
lower_white = np.array([0, 0, 220])
upper_white = np.array([180, 30, 255])
mask_white = cv2.inRange(hsv_white, lower_white, upper_white)

# Optionally, display the mask to debug:
# cv2.imshow('White Mask', mask_white)
# cv2.waitKey(0)

# Find contours for white areas
contours_white, _ = cv2.findContours(mask_white, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

for contour in contours_white:
    area = cv2.contourArea(contour)
    if area > 100:  # adjust the threshold to ignore noise
        x, y, w, h = cv2.boundingRect(contour)
        cv2.rectangle(image_white, (x, y), (x + w, y + h), (0, 0, 255), 2)

# Display the result with white areas highlighted
cv2.imshow('White Areas Highlighted', image_white)
cv2.waitKey(0)
cv2.destroyAllWindows()

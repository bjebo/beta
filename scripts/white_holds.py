import cv2
import numpy as np

# Load the image (adjust the path as needed)
image = cv2.imread('assets/climbing_examples/climbing_wall.jpg')
if image is None:
    raise Exception("Image not found. Check the file path.")

# Option 1: Use HSV color space for thresholding white
hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
# For white, low saturation and high value is expected.
# Adjust these thresholds as needed.
lower_white = np.array([0, 0, 220])
upper_white = np.array([180, 30, 255])
mask = cv2.inRange(hsv, lower_white, upper_white)

# # Adjusted thresholds for pure white:
# lower_white = np.array([0, 0, 240])      # low saturation, very high brightness
# upper_white = np.array([180, 20, 255])     # allow only slight variation in saturation
# mask_white = cv2.inRange(hsv_white, lower_white, upper_white)


# Option 2 (alternative): Directly threshold in BGR
# Uncomment the next two lines to try BGR thresholding instead of HSV.
# lower_white = np.array([200, 200, 200])
# mask = cv2.inRange(image, lower_white, np.array([255, 255, 255]))

# Find contours in the mask
contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Draw red bounding boxes around each contour
for contour in contours:
    area = cv2.contourArea(contour)
    if area > 100:  # Adjust the minimum area threshold as needed to ignore noise
        x, y, w, h = cv2.boundingRect(contour)
        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 0, 255), 2)

# Display the result
cv2.imshow('White Areas Highlighted', image)
cv2.waitKey(0)
cv2.destroyAllWindows()

import asyncio

import cv2
import mediapipe as mp

mp_hands = mp.solutions.hands
mp_draw = mp.solutions.drawing_utils
hands = mp_hands.Hands(min_detection_confidence=0.7, min_tracking_confidence=0.8)


async def run_gesture_detection(queue):
    cap = cv2.VideoCapture(0)
    motion_cooldown = False  # Prevents false detections
    cooldown_frames = 10  # Frames to wait before allowing another detection
    cooldown_counter = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)  # Flip horizontally for natural interaction
        h, w, _ = frame.shape
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(rgb_frame)

        if motion_cooldown:
            cooldown_counter += 1
            if cooldown_counter > cooldown_frames:
                motion_cooldown = False
                cooldown_counter = 0

        if results.multi_hand_landmarks and not motion_cooldown:
            for hand_landmarks in results.multi_hand_landmarks:
                mp_draw.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

                landmarks = hand_landmarks.landmark

                # Get key points
                index_tip = landmarks[mp_hands.HandLandmark.INDEX_FINGER_TIP]
                index_mcp = landmarks[mp_hands.HandLandmark.INDEX_FINGER_MCP]
                thumb_tip = landmarks[mp_hands.HandLandmark.THUMB_TIP]
                pinky_tip = landmarks[mp_hands.HandLandmark.PINKY_TIP]

                index_tip_y = int(index_tip.y * h)
                index_mcp_y = int(index_mcp.y * h)
                thumb_tip_y = int(thumb_tip.y * h)
                pinky_tip_y = int(pinky_tip.y * h)

                # Pointing Up Detection (Index finger extended, others curled)
                if (
                    index_tip_y < index_mcp_y
                    and thumb_tip_y > index_mcp_y
                    and pinky_tip_y > index_mcp_y
                ):
                    print("Pointing Up Detected")
                    await queue.put("GESTURE_UP")
                    motion_cooldown = True

                # Fist Detection (All fingers curled)
                elif (
                    index_tip_y > index_mcp_y
                    and thumb_tip_y > index_mcp_y
                    and pinky_tip_y > index_mcp_y
                ):
                    print("Fist Detected")
                    await queue.put("GESTURE_FIST")
                    motion_cooldown = True

        cv2.imshow("Gesture Test", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

        await asyncio.sleep(0.01)  # Small delay to prevent CPU hogging

    cap.release()
    cv2.destroyAllWindows()

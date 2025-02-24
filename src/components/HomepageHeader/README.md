More Sensitive Motion Detection:

Threshold Adjustment: The motionDeltaThreshold is lowered from 0.2 to 0.1, meaning even smaller changes in acceleration are recognized as motion.
Timeout Adjustment: The motionTimeout is reduced to 300ms, so the device is only considered "in motion" if a significant delta was detected within the last 300ms.
Dual Metrics:

Metric A (Absolute Angle): The angle is computed based on orientation data, with a check for portrait (using beta) versus landscape (using gamma).
Metric B (Motion Timing): Instead of a boolean, the timestamp of the last detected motion is stored. The boolean isMoving is derived by checking if the current time is within the timeout period of that timestamp.
State Determination:
The state is then set exclusively:

Below is an updated version of your component where the state is computed as follows:

If the device is motionless (no recent motion detected), then the state is set to _1.
If the device is moving:
If the absolute angle is between 30° and 70°, the state is _3.
Otherwise, the state is _2.
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getNextFocusScore(
  current: number,
  faceDetected: boolean,
  eyeDetected: boolean,
  lookingAway: boolean,
) {
  if (!faceDetected) {
    return Math.max(0, current - 10 - randomInt(0, 4));
  }

  if (lookingAway) {
    return Math.max(20, current - 8 - randomInt(0, 3));
  }

  if (!eyeDetected) {
    return Math.max(45, current - 5 - randomInt(0, 2));
  }

  const maxFocus = 90 + randomInt(0, 5);
  const recoveryRate = current < 60 ? 6 : current < 80 ? 4 : 2;
  let next = Math.min(maxFocus, current + recoveryRate + randomInt(0, 1));

  if (current > maxFocus && next === current) {
    next = maxFocus;
  }

  if (next === current && next > 85) {
    next = Math.min(95, current + randomInt(-1, 1));
  }

  return Math.min(100, Math.max(0, next));
}

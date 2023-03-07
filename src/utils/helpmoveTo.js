export function helpmoveTo(ball, position, destination, ballRef) {
  const distance = Math.sqrt(
    (destination.x - position.x) ** 2 + (destination.y - position.y) ** 2
  );
  const duration = distance / 50; // adjust the speed of the animation
  ball.style.transition = `transform ${duration}s ease-out`;
  const xTranslation = Math.min(
    destination.x - position.x,
    200 - position.x - ballRef.current.offsetWidth
  );
  const yTranslation = Math.min(
    destination.y - position.y,
    200 - position.y - ballRef.current.offsetHeight
  );
  ball.style.transform = `translate(${xTranslation}px, ${yTranslation}px)`;

  setTimeout(() => {
    ball.style.left = parseInt(ball.style.left) + xTranslation + "px";
    ball.style.top = parseInt(ball.style.top) + yTranslation + "px";
  }, duration * 1000);
}

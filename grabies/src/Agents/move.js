export function moveTo(ball, position, destination, ballRef) {
    const distance = Math.sqrt(
      (destination[0] - position[0]) ** 2 + (destination[1] - position[1]) ** 2
    );
    const duration = distance / 50; // adjust the speed of the animation
    ball.style.transition = `transform ${duration}s ease-out`;
    // const xTranslation = destination[0] - position[0]
    // const yTranslation = destination[1] - position[1]
    const xTranslation = Math.min(
      destination[0] - position[0],
      200 - position[0] - ballRef.current.offsetWidth
    );
    const yTranslation = Math.min(
      destination[1] - position[1],
      200 - position[1] - ballRef.current.offsetHeight
    );
    ball.style.transform = `translate(${xTranslation}px, ${yTranslation}px)`;
    
    ball.style.left = position[0] + "px";
    ball.style.top = position[1] + "px";
    // setTimeout(() => {}, duration * 1000);
    };
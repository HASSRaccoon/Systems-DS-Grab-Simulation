export function moveTo(ball, position, destination, ballRef, speed = [1, 1]) {
    speed = [1, 1] // make constant speed first
    const distance = Math.sqrt(
      (destination[0] - position[0]) ** 2 + (destination[1] - position[1]) ** 2
    );
    const animationSpeed = Math.sqrt((speed[0]) ** 2 + (speed[1]) ** 2);
    const duration = (animationSpeed ); // adjust the speed of the animation
    // const duration = 1;
    ball.style.transition = `transform ${duration}s ease-out`;
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
    };
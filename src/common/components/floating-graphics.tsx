export function FloatingGraphics() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
      <div className="relative w-[55%] max-w-[450px] aspect-square flex items-center justify-center mt-8">
        <img
          src="/images/brain.png"
          alt="Brain graphic"
          className="absolute inset-0 w-full h-full object-contain animate-float-slow"
        />
        <img
          src="/images/ingredients.png"
          alt="Ingredients graphic"
          className="absolute inset-0 w-full h-full object-contain animate-float-medium"
        />
      </div>
    </div>
  );
}

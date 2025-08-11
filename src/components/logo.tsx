
export function Logo() {
  return (
    <div className="flex items-center justify-center gap-2" aria-label="Strength of Faculty home">
      <div className="bg-primary p-2 rounded-md">
        <svg
            className="h-6 w-6 text-primary-foreground"
            viewBox="0 0 100 100"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path
                d="M50 35C45.8333 35 42.5 35.8333 40 37.5V15C40 12.2386 42.2386 10 45 10H80C82.7614 10 85 12.2386 85 15V37.5C82.5 35.8333 79.1667 35 75 35H50Z"
            />
            <path
                d="M35 45C32.2386 45 30 47.2386 30 50V60C30 62.7614 32.2386 65 35 65H45C47.7614 65 50 62.7614 50 60V50C50 47.2386 47.7614 45 45 45H35Z"
            />
            <path
                d="M40 65C38.3333 66.6667 37.5 70 37.5 75V90H70C70 85 68.3333 81.6667 65 80L55 70L40 65Z"
            />
        </svg>
      </div>
      <span className="text-xl font-bold font-headline text-foreground">Strength of Faculty</span>
    </div>
  );
}

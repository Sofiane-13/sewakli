export default function Header() {
  return (
    <header className="bg-background-light dark:bg-background-dark p-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white text-center flex-1">
        Translink Express
      </h1>
      <button className="text-gray-900 dark:text-white">
        <span className="material-symbols-outlined">menu</span>
      </button>
    </header>
  )
}

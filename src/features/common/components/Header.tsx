import { Link } from '@tanstack/react-router'
import { ModeToggle } from './mode-toggle'

export default function Header() {

  return (
    <>
      <header className="p-4 flex items-center bg-background text-content shadow-lg">
        <div className='flex items-center justify-between w-full'>
          <h1 className="ml-4 text-xl font-semibold">
            <Link to="/">
              Job App Tracker
            </Link>
          </h1>
          <ModeToggle />
        </div>
      </header>
    </>
  )
}

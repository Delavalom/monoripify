import { Github } from 'lucide-react'
import { Inter } from 'next/font/google'
import { Button } from '~/components/ui/button'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center gap-2 ${inter.className}`}
    >
      <header className='border-b-2 flex justify-between w-full h-fit p-4'>
        <div>
          <div className='flex gap-2 items-center'>
            {/* name and logo */}
            <Github className='w-6 h-6' />
            <h1 className='text-2xl font-medium'>Monoripify</h1>
          </div>
          <nav>
            {/*  */}
            <ul className='flex gap-2 text-sm font-medium'>
              <li>acme</li>
              <li>private</li>
              <li>main</li>
              <li>protected</li>
            </ul>
          </nav>
        </div>
        <div>
          <Button variant="outline">View on github</Button>
        </div>
      </header>
      <main>
        <section>
          {/* build analitycs */}
        </section>
        <section>
          {/* tabs */}
          <div></div>
          <section>
            {/* packages and apps table */}
            <div>
              <div>
                  {/* img name, subtitle  */}
                  <img src="" alt="" />
                  <div>
                  <h1>acme</h1>
                  <h2>docs</h2>
                  </div>
              </div>
              <div>
                  {/* las commit  */}
                  <div>
                    <h2>commit name</h2>
                    <h2>5m ago from</h2>
                  </div>
              </div>
              <div>
                  {/* 3 dots config  */}
              </div>
            </div>
          </section>
        </section>
      </main>
    </main>
  )
}

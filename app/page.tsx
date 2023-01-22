
// import styles from '../styles/Home.module.css';
import './globals.css'
// import Home from '@/pages/home';
import Link from 'next/link'

export default function Home() {

  return (
    <div className="h-screen grid place-content-center">
        <Link href="/home" className="p-5 shadow-md shadow-blue-600/50 bg-blue-600 text-white font-bold text-2xl rounded-3xl hover:bg-blue-500 hover:shadow-blue-500/50 hover:mb-2">Click to access the app.</Link>
    </div>
  );
}
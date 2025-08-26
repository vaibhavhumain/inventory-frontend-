import Link from 'next/link'
export default function Landing() {
  return (
    <>
    This is my landing page 
    <div>
      <Link href="/login">Go to Login Page</Link>
    </div>
    </>
  )
}

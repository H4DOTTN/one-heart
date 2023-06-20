import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Funds",
  description: "Funds",
}
export default function FundsPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-4xl font-bold leading-tight">Funds</h1>
      </div>
    </section>
  )
}

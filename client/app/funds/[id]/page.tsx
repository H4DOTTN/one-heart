import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fund",
  description: "Fund",
}

export default function FundPage({ params }: { params: { id: string } }) {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-4xl font-bold leading-tight">
          Funding {params.id}
        </h1>
      </div>
    </section>
  )
}

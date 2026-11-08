import { OrderForm } from "@/features/order/components/order-form";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-10 sm:px-6 sm:py-16">
      <header className="mb-10">
        <p className="text-xs font-bold tracking-[0.24em] text-violet-400">
          CREDO STORE
        </p>
        <div className="mt-5 max-w-3xl">
          <p className="text-sm font-medium text-zinc-400">
            MOBILE LEGENDS RANK SERVICE
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50 sm:text-5xl">
            Pilih layanan. Atur target rank.
            <span className="block text-violet-400">Cek estimasi harga.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base sm:leading-7">
            Pilih layanan Credo Store dan isi detail pesanan. Kamu dapat meninjau
            estimasi biaya sebelum melanjutkan proses pemesanan.
          </p>
        </div>
      </header>

      <OrderForm />

      <footer className="mt-10 border-t border-zinc-800 pt-5 text-xs leading-5 text-zinc-500">
        Credo Store · Pemesanan dan konfirmasi layanan dilakukan langsung dengan toko.
        Tidak ada password akun yang diminta melalui formulir.
      </footer>
    </main>
  );
}

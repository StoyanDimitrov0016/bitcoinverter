import Image from "next/image";

export function BitcoinSymbol() {
  return (
    <Image
      aria-hidden="true"
      className="inline-block size-[0.8em] shrink-0"
      height={144}
      src="/bitcoin.svg"
      width={144}
      alt=""
    />
  );
}

export function ConverterBitcoinSymbol() {
  return (
    <>
      <Image
        aria-hidden="true"
        className="inline-block size-4 shrink-0 dark:hidden"
        height={24}
        src="/bitcoin-black.svg"
        width={24}
        alt=""
      />
      <Image
        aria-hidden="true"
        className="hidden size-4 shrink-0 dark:inline-block"
        height={24}
        src="/bitcoin-white.svg"
        width={24}
        alt=""
      />
    </>
  );
}

export function SatoshiSymbol() {
  return (
    <>
      <Image
        aria-hidden="true"
        className="inline-block size-4 shrink-0 dark:hidden"
        height={24}
        src="/satoshi-black.svg"
        width={24}
        alt=""
      />
      <Image
        aria-hidden="true"
        className="hidden size-4 shrink-0 dark:inline-block"
        height={24}
        src="/satoshi-white.svg"
        width={24}
        alt=""
      />
    </>
  );
}

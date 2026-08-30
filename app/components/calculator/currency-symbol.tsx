import Image from "next/image";

export function BitcoinSymbol() {
  return (
    <Image
      aria-hidden="true"
      className="inline-block size-[0.8em] shrink-0"
      height={144}
      src="/bitcoin-symbol.svg"
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
        src="/bitcoin-simple-svgrepo-com-dark.svg"
        width={24}
        alt=""
      />
      <Image
        aria-hidden="true"
        className="hidden size-4 shrink-0 dark:inline-block"
        height={24}
        src="/bitcoin-simple-svgrepo-com-light.svg"
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
        src="/satoshi-v2-svgrepo-com-dark.svg"
        width={24}
        alt=""
      />
      <Image
        aria-hidden="true"
        className="hidden size-4 shrink-0 dark:inline-block"
        height={24}
        src="/satoshi-v2-svgrepo-com-light.svg"
        width={24}
        alt=""
      />
    </>
  );
}

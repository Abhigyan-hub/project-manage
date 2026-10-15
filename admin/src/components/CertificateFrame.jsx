import certificateBg from "../assets/certificate-bg.png";

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

export default function CertificateFrame({ children }) {
  return (
    <div
      className="relative mx-auto overflow-hidden bg-white"
      style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT }}
    >
      <img
        src={certificateBg}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full"
        draggable={false}
      />
      <div className="relative z-10 h-full w-full">{children}</div>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[148px] overflow-hidden">
        <img
          src={certificateBg}
          alt=""
          draggable={false}
          className="absolute left-0 top-0 max-w-none"
          style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT }}
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[158px] overflow-hidden">
        <img
          src={certificateBg}
          alt=""
          draggable={false}
          className="absolute left-0 max-w-none"
          style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT, bottom: 0 }}
        />
      </div>
    </div>
  );
}

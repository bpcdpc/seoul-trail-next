type StatusScreenProps = {
  backgroundColor?: string;
  message?: string;
  children?: React.ReactNode;
};

export default function StatusScreen({
  backgroundColor = "",
  message,
  children,
}: StatusScreenProps) {
  return (
    <div
      className={`fade-in flex flex-col gap-4 items-center justify-center w-screen h-dvh ${backgroundColor}`}
    >
      {message && <div>{message}</div>}
      {children ? children : ""}
    </div>
  );
}

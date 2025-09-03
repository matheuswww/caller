// useAlertSystem.tsx
import { JSX, useState } from "react";

export type AlertType = "green" | "red" | "yellow";

interface Alert {
  id: number;
  message: string;
  type: AlertType;
  duration: number;
  visible: boolean;
}

export function useAlertSystem(): [
  JSX.Element,
  (message: string, type?: AlertType, duration?: number) => void
] {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = (message: string, type: AlertType = "green", duration = 3000) => {
    const id = Date.now() + Math.random();
    const newAlert: Alert = { id, message, type, duration, visible: false };

    setAlerts(prev => [...prev, newAlert]);

    setTimeout(() => {
      setAlerts(prev =>
        prev.map(a => (a.id === id ? { ...a, visible: true } : a))
      );
    }, 10);

    setTimeout(() => {
      setAlerts(prev =>
        prev.map(a => (a.id === id ? { ...a, visible: false } : a))
      );

    setTimeout(() => {
        setAlerts(prev => prev.filter(a => a.id !== id));
      }, 500);
    }, duration);
  };

  const alertComponent = (
    <div className="fixed top-5 right-5 flex flex-col gap-3 z-50" tabIndex={0}>
      {alerts.map(alert => (
        <div
          key={alert.id}
          className={`
            w-[300px]
            h-[80px]
            grid justify-center items-center
            transform transition-all duration-500
            ${alert.visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
            px-4 py-2 rounded shadow-lg text-white
            ${alert.type === "green" ? "bg-green-600" : ""}
            ${alert.type === "red" ? "bg-red-500" : ""}
            ${alert.type === "yellow" ? "bg-yellow-600" : ""}
          `}
        >
          <p className="font-bold text-center">{alert.message}</p>
        </div>
      ))}
    </div>
  );

  return [alertComponent, addAlert];
}

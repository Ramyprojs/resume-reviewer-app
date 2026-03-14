"use client";

import { useEffect } from "react";

const CLICK_REACTIVE_SELECTOR = "[data-click-reactive='true']";

export function ClickFeedback() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const trigger = target?.closest<HTMLElement>(CLICK_REACTIVE_SELECTOR);

      if (!trigger) {
        return;
      }

      if (
        trigger instanceof HTMLButtonElement ||
        trigger instanceof HTMLInputElement ||
        trigger instanceof HTMLTextAreaElement
      ) {
        if (trigger.disabled) {
          return;
        }
      }

      if (trigger.getAttribute("aria-disabled") === "true") {
        return;
      }

      const rect = trigger.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height) * 1.15;
      const left = event.clientX - rect.left - size / 2;
      const top = event.clientY - rect.top - size / 2;

      ripple.className = "click-ripple";
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${left}px`;
      ripple.style.top = `${top}px`;

      trigger.appendChild(ripple);

      window.setTimeout(() => {
        ripple.remove();
      }, 520);
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  return null;
}

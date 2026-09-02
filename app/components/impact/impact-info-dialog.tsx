import { buttonVariants, InfoIcon, Modal } from "@heroui/react";
import type { ReactNode } from "react";

type ImpactInfoDialogProps = {
  ariaLabel: string;
  title: string;
  children: ReactNode;
};

export function ImpactInfoDialog({ ariaLabel, title, children }: ImpactInfoDialogProps) {
  return (
    <Modal>
      <Modal.Trigger
        aria-label={ariaLabel}
        className={buttonVariants({
          className: "inline-flex shrink-0 items-center justify-center p-0 leading-none",
          isIconOnly: true,
          size: "sm",
          variant: "ghost",
        })}
      >
        <InfoIcon aria-hidden="true" className="block size-4 shrink-0" />
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-lg">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{title}</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="space-y-3 text-sm leading-6 text-muted">{children}</Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

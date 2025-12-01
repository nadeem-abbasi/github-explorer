import type { FC, ReactNode } from 'react';
import { ChevronDownIcon } from '../../../icons';
import styles from './Accordion.module.css';

export type AccordionProps = {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
  contentId: string;
  headerId?: string;
};

export const Accordion: FC<AccordionProps> = ({
  title,
  isExpanded,
  onToggle,
  children,
  contentId,
  headerId,
}: AccordionProps) => {
  return (
    <div className={styles.accordion}>
      <button
        id={headerId}
        className={styles.header}
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={contentId}
      >
        <span className={styles.username}>{title}</span>
        <ChevronDownIcon
          className={`${styles.caret} ${
            isExpanded ? styles.caretExpanded : ''
          }`}
        />
      </button>

      {isExpanded && (
        <div
          id={contentId}
          className={styles.content}
          role="region"
          aria-labelledby={headerId}
        >
          {children}
        </div>
      )}
    </div>
  );
};

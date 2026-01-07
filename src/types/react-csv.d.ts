declare module "react-csv" {
  import * as React from "react";

  export interface CSVLinkProps {
    data: string | (string | number)[][] | Record<string, unknown>[];
    headers?: Array<{ label: string; key: string }>;
    filename?: string;
    separator?: string;
    enclosingCharacter?: string;
    target?: string;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
    asyncOnClick?: boolean;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }

  export class CSVLink extends React.Component<CSVLinkProps> {}
  export class CSVDownload extends React.Component<CSVLinkProps> {}
}

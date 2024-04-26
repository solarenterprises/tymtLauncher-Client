import { IChain } from "./walletTypes";

export interface propsInputTypes {
  id: string;
  label: string;
  type: string;
  name?: string;
  setValue?: (data: string) => void;
  value?: string;
  onChange?: {
    (e: React.ChangeEvent<any>): void;
    <T_1 = string | React.ChangeEvent<any>>(
      field: T_1
    ): T_1 extends React.ChangeEvent<any>
      ? void
      : (e: string | React.ChangeEvent<any>) => void;
  };
  onBlur?: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  error?: boolean;
  onIconButtonClick?: () => void;
  onAddressButtonClick?: () => void;
}

export interface propsAlertTypes {
  open: boolean;
  status: string;
  title: string;
  detail: any;
  setOpen: (open: boolean) => void;
  link: string;
}

export interface propsWalletCard {
  data: IChain;
  index: number;
  setLoading: (_: boolean) => void;
}

export interface propsSwitchComp {
  checked: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export interface propsChainBox {
  data: IChain;
  onClick: (chain: IChain) => void;
}

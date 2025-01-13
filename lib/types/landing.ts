export interface LandingPageProps {
  template: Template;
}

// 랜딩페이지 콘텐츠 타입
export type LandingContent = {
  type: "text" | "image" | "navbar";
  content: string;
  style?: {
    [key: string]: string | number;
  };
  tailwindClasses?: string;
};

export type ComponentType = "text" | "image" | "button" | "margin" | "section" | "divider";

export interface BaseComponent {
  id: string;
  type: ComponentType;
  style: React.CSSProperties;
  tailwindClasses?: string;
  useDefaultPadding?: boolean;
  parentId?: string;
  _imageMeta?: {
    deleteState: "none" | "pending" | "deleted";
    originalUrl?: string;
  };
  borderStyle?: BorderStyleType;
  borderWidth?: number;
  borderColor?: string;
  borderOpacity?: number;
}

export type BorderStyleType = "none" | "solid" | "dotted" | "dashed" | "double";

export interface PaddingProps {
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
}

// 배경 관련 속성들을 위한 공통 인터페이스
export interface BackgroundProps {
  backgroundImage?: string;
  backgroundRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  backgroundColor?: string;
  backgroundOpacity?: number;
  backgroundFixed?: boolean;
  _imageMeta?: {
    deleteState: "none" | "pending" | "deleted";
    originalUrl?: string;
  };
}

export interface BorderProps {
  borderRadius?: number;
}

export interface TextComponent extends BaseComponent, BackgroundProps, PaddingProps, BorderProps {
  type: "text";
  content: string;
  fontSize: string | number;
  fontWeight?: string;
  color?: string;
  textAlign: "left" | "center" | "right" | "justify";
  useDefaultPadding?: boolean;
  borderStyle?: "none" | "solid" | "dotted" | "dashed" | "double";
  borderColor?: string;
  borderWidth?: number;
  borderOpacity?: number;
  linkType?: "none" | "url" | "tel" | "email";
  linkValue?: string;
  textColor?: string;
  textOpacity?: number;
  letterSpacing: string | number;
  lineHeight?: string;
  openInNewTab?: boolean;
}

export interface ImageComponent extends BaseComponent, BorderProps, BackgroundProps {
  type: "image";
  src?: string;
  alt?: string;
  useDefaultPadding?: boolean;
  fillMode?: "cover" | "contain";
  height?: number;
  fixedHeight?: boolean;
  keepOriginalRatio?: boolean;
  isCircle?: boolean;
  _imageMeta?: {
    deleteState: "none" | "pending" | "deleted";
    originalUrl?: string;
  };
  description?: string;
  descriptionDisplay?: "hidden" | "below" | "overlay";
  descriptionFontSize?: number;
  descriptionColor?: string;
  descriptionOpacity?: number;
  descriptionPosition?: "top-left" | "top-center" | "top-right" | "center-left" | "center" | "center-right" | "bottom-left" | "bottom-center" | "bottom-right";
}

export interface ButtonComponent extends BaseComponent, BorderProps {
  type: "button";
  text: string;
  variant: "primary" | "secondary" | "outline";
  fontSize: number;
  paddingX: number;
  paddingY: number;
  letterSpacing: number;
  fullWidth: boolean;
  align: "left" | "center" | "right";
  link?: string;
  openInNewTab?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
  iconSize?: number;
  backgroundColor?: string;
  backgroundOpacity?: number;
  textColor?: string;
  textOpacity?: number;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  useCustomBorderRadius?: boolean;
  borderRadiusTopLeft?: number;
  borderRadiusTopRight?: number;
  borderRadiusBottomLeft?: number;
  borderRadiusBottomRight?: number;
  hoverBackgroundColor?: string;
  hoverBackgroundOpacity?: number;
  hoverTextColor?: string;
  hoverTextOpacity?: number;
  hoverBorderColor?: string;
  hoverBorderOpacity?: number;
  hoverBorderWidth?: number;
  hoverBorderStyle?: BorderStyleType;
}

export interface ContainerComponent extends BaseComponent, BackgroundProps, BorderProps {
  type: "section";
  children: LandingComponent[];
  layout: "horizontal" | "vertical";
  isFullWidth?: boolean;
  useDefaultPadding?: boolean;
  isSticky?: boolean;
  textColor?: string;
  textOpacity?: number;
  verticalPadding?: number;
  horizontalPadding?: number;
  verticalGap?: number;
  horizontalGap?: number;
}

export interface MarginComponent extends BaseComponent, BorderProps {
  type: "margin";
}

export interface DividerComponent extends BaseComponent {
  type: "divider";
  thickness: number;
  alignment: "left" | "center" | "right";
  lineStyle: "solid" | "dashed" | "dotted";
  color: string;
  opacity: number;
  width: number;
  widthUnit: "%" | "px";
}

export type LandingComponent = TextComponent | ImageComponent | ButtonComponent | MarginComponent | ContainerComponent | DividerComponent;

export interface Template {
  id: string;
  title: string;
  description: string;
  content: LandingComponent[];
  createdAt: string;
  updatedAt: string;
}

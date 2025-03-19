interface TwitterWidgets {
  createTweet: (
    tweetId: string,
    container: HTMLElement,
    options?: {
      theme?: "light" | "dark";
      cards?: "hidden" | "visible";
      conversation?: "none" | "all";
      width?: string | number;
      align?: "left" | "center" | "right";
      lang?: string;
      dnt?: boolean;
    }
  ) => Promise<HTMLElement>;
}

interface TwitterJS {
  widgets: TwitterWidgets;
}

declare global {
  interface Window {
    twttr: TwitterJS;
  }
}

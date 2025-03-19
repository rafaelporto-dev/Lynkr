interface InstagramEmbedsProcess {
  process: () => void;
}

declare global {
  interface Window {
    instgrm: {
      Embeds: InstagramEmbedsProcess;
    };
  }
}

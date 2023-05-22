import Pusher from "pusher";

const pusher = new Pusher({
  appId: "1602733",
  key: "8480959283852d2d55a4",
  secret: "c7f505c82e74f744cea6",
  cluster: "us2",
  useTLS: true,
});

export async function sendMessage() {
  await pusher.trigger("my-channel", "my-event", {
    message: "hello world",
  });
}

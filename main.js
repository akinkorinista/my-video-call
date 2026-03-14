// --- 設定エリア ---
const appId = "fc1da21a9bd74503be0443f578d04ef4"; // ここを自分のApp IDに書き換え
const channel = "test-channel"; // 通話部屋の名前（何でもOK）
const token = null; // テストモードならnullでOK

// Agoraのクライアント（通信の司令塔）を作成
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

// 自分の音声と映像を管理する変数
let localTracks = {
  videoTrack: null,
  audioTrack: null,
};
// --- 相手が参加した時に実行される処理 ---
client.on("user-published", async (user, mediaType) => {
  // 1. 相手の情報を購読（Subscribe）する
  await client.subscribe(user, mediaType);

  if (mediaType === "video") {
    // 2. 相手のビデオを "remote-player" 枠で再生する
    user.videoTrack.play("remote-player");
  }

  if (mediaType === "audio") {
    // 3. 相手の音声を再生する
    user.audioTrack.play();
  }
});
// --- 「通話開始」ボタンを押した時の処理 ---
document.getElementById("join-btn").onclick = async function () {
  // 1. チャンネルに参加する
  await client.join(appId, channel, token, null);

  // 2. マイクとカメラを起動して「トラック」を作成
  localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();

  // 3. 自分の画面（local-player）に映像を映す
  localTracks.videoTrack.play("local-player");

  // 4. ネットワークに乗せて、自分の映像と音声を「公開」する
  await client.publish([localTracks.audioTrack, localTracks.videoTrack]);

  console.log("参加完了！カメラが起動しました。");
};

// --- 「終了」ボタンを押した時の処理 ---
document.getElementById("leave-btn").onclick = async function () {
  // トラック（カメラ・マイク）を止める
  localTracks.videoTrack.stop();
  localTracks.videoTrack.close();
  localTracks.audioTrack.close();

  // チャンネルから退室
  await client.leave();

  console.log("退室しました。");
};

//アプリID

// 8e68e4fe89994a72ade1554bdf8294b3

// CORE-SDK

// import AgoraUIKit from "agora-rn-uikit";

// const App = () => {
//   const connectionData = {
//     appId: "e7f6e9aeecf14b2ba10e3f40be9f56e7",

//     channel: "test",

//     token: null, // enter your channel token as a string
//   };

//   return <AgoraUIKit connectionData={connectionData} />;
// };

// export default App;

const grayConfig = {
  whiteList: ["111", "222", "333"], // 灰度白名单
  minClientVersion: "9.0.35", // 最低客户端版本号限制
  tails: ["0", "25"], // 尾号名单
  isPublish: false, // 业务是否已全部发布
};
function checkIsGrayUser(uid, clientVersion) {
  let isGrayUser = false;
  // todo: 判断用户是否符合灰度条件。逻辑：(业务已全量发布 或 命中白名单 或 命中尾号逻辑）且符合客户端版本号限制条件
  return isGrayUser;
}
checkIsGrayUser("111", "9.0.15");


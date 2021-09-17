export const Resp = {
  success: {
    errorCode: 0,
  },

  backendCheckSessionFail: {
    errorCode: 401,
    errorMessage: '登入逾期',
  },

  // Api Fail
  paramInputEmpty: {
    errorCode: 1000,
    errorMessage: '缺少參數',
  },

  paramInputFormatError: {
    errorCode: 1001,
    errorMessage: '參數輸入錯誤',
  },

  // DB Fail
  sqlExecFail: {
    errorCode: 2000,
    errorMessage: '資料庫執行失敗',
  },

  sqlQueryFail: {
    errorCode: 2001,
    errorMessage: '資料庫搜尋失敗',
  },

  sqlIDnotExist: {
    errorCode: 2002,
    errorMessage: 'ID不存在',
  },

  // User Fail
  UserNotExist: {
    errorCode: 3000,
    errorMessage: '使用者不存在',
  },

  LoginFail: {
    errorCode: 3001,
    errorMessage: '登入失敗',
  },
};

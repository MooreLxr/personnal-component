const fs = require('fs')
const os = require('os')
/**
 * 获取当前系统桌面路径
 */
export function getHomeDir() {
  const platform = process.platform
  console.log('操作系统:' + platform)
  const homedirPath = os.homedir().replace(/\\/g, '/')
  // console.log('home路径:' + homedirPath)
  let destDir
  switch(platform) {
    case 'aix':
      break
    case 'darwin':
      break
    case 'linux':
      if (fs.existsSync(homedirPath + '/Desktop')) destDir = homedirPath + '/Desktop/'
      else if (fs.existsSync(homedirPath + '/desktop')) destDir = homedirPath + '/desktop/'
      else if (fs.existsSync(homedirPath + '/桌面')) destDir = homedirPath + '/桌面/'
      else if (homedirPath === '/root/') destDir = '/home'
      break
    case 'win32':
      destDir = homedirPath + '/Desktop/'
      break
  }
  return destDir
}

/**
 * 获取当前系统home路径
 */
export function getHome() {
  const homedirPath = os.homedir().replace(/\\/g, '/')
  return homedirPath
}

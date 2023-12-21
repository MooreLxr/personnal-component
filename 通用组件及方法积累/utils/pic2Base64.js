export function pic2Base64(file) {
  return new Promise((resolve, reject) =&gt; {
    let fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    let imgResult = ''
    fileReader.onload = () =&gt; {
      imgResult = fileReader.result
    }
    fileReader.onerror = (error) =&gt; {
      reject(error)
    }
    fileReader.onloadend = () =&gt; {
      resolve(imgResult)
    }
  })
}

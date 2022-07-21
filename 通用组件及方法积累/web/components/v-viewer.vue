<script>
import Vue from 'vue'
import Viewer from "v-viewer"
import "viewerjs/dist/viewer.css"
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999,
    navbar: true,
    title: false,
    zoomRatio: 0.3,
    toolbar: {
      zoomIn: true,
      zoomOut: true,
      reset: true,
      rotateLeft: true,
      rotateRight: true,
      prev: true,
      next: true,
      play: false,
      flipHorizontal: false,
      flipVertical: false
    }
  }
})
export default {}
</script>
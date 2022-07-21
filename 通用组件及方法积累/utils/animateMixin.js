export default {
  data () {
    return {
      curPage: 1,
      distance: 0
    }
  },
  methods: {
    /**
     * 翻页滚动，参数全部必传！！！
     * @param container 容器
     * @param source 数据源
     * @param num 一页展示的数量
     * @returns
     */
    turnPageScroll (container, source, num) {
      this.animateTimer && clearTimeout(this.animateTimer)
      const eleDom = this.$refs[container]
      const totalPages = Math.ceil(source.length / num) // 总页数
      // if (totalPages <= 1) return
      const h = eleDom.clientHeight

      const scroll = () => {
        this.curPage = this.curPage < totalPages ? (this.curPage + 1) : 1
        eleDom.style.transform = `translateY(-${(this.curPage - 1) * h}px)`
        this.animateTimer = setTimeout(() => scroll(), 15000)
      }
      scroll()
    },
    stopPageScroll () {
      this.animateTimer && clearTimeout(this.animateTimer)
    },
    /**
     * @param container 容器
     * @returns
     */
    autoScroll (container) {
      this.animateTimer2 && cancelAnimationFrame(this.animateTimer2)
      const eleDom = this.$refs[container]
      const totalHeight = eleDom.scrollHeight
      const clientHeight = eleDom.clientHeight
      // 数据量少不需要滚动
      if (eleDom.scrollHeight <= eleDom.clientHeight) return
      const scroll = () => {
        if (this.distance === (totalHeight - clientHeight)) this.distance = 0
        else this.distance += 1
        eleDom.style.transform = `translateY(-${this.distance}px)`
        this.animateTimer2 = requestAnimationFrame(scroll)
      }
      scroll()
    },
    stopScroll () {
      this.animateTimer2 && cancelAnimationFrame(this.animateTimer2)
    }
  },
  beforeDestroy () {
    this.animateTimer && clearTimeout(this.animateTimer)
    this.animateTimer2 && cancelAnimationFrame(this.animateTimer2)
  }
}
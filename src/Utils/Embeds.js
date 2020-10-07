module.exports = class Embeds {
    contructor() {
        this.fields = new Array()
    }
    title(t) {
        this.title = t
        return this
    }
    author(txt, img) {
        this.author.icon_url = img
        this.author.name = txt
        return this
    }
    description(d) {
        this.description = d
        return this
    }
    timestamp(t) {
        this.timestamp = t
        return this
    }
    color(c) {
        this.color = c
        return this
    }
    footer(t) {
        this.footer.text = t
        return this
    }
    img(i) {
        this.image.url = i
        return this
    }
    thumbnail(t) {
        this.thumbnail.url = t
        return this
    }
    setFields(f) {
        this.fields = f
        return this
    }
    addField(f) {
        this.fields.push(f)
        return this
    }
}
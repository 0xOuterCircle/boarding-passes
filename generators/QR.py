import qrcode

if __name__ == "__main__":

    name = "Pioneer"
    qr_box_size = 10

    with open(f"{name}.csv", "r") as data:

        data.readline()
        for line in data.readlines():
            id_, link = line.split(",")
            link = link.replace('"', "").replace("\n", "")
            print(link)
            img = qrcode.make(link, border=1, box_size=qr_box_size)
            img.save(f"QRs/{name}/{id_}.png")

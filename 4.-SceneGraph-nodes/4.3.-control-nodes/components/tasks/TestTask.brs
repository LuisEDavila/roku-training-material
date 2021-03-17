sub init()
    m.top.functionName = "getContent"
end sub 

sub getContent()
    finished = false

    port = CreateObject("roMessagePort")
    request = CreateObject("roUrlTransfer")
    request.SetMessagePort(port)
    request.SetCertificatesFile("common:/certs/ca-bundle.crt")
    request.SetUrl("https://jsonplaceholder.typicode.com/albums/1/photos")
    request.AsyncGetToString()

    while NOT finished
        msg = wait(0, port)
        if type(msg) = "roUrlEvent"
            finished = true
            buildContentNode(msg.getString())
        end if
    end while
end sub

sub buildContentNode(data as string)
    content = CreateObject("roSGNode", "ContentNode")

    row = content.createChild("ContentNode")
    row.title = "Row data from server"

    items = ParseJson(data)

    for each item in items
        itemContent = row.createChild("ContentNode")
        itemContent.title = item.title
        itemContent.HDPosterUrl = item.url
    end for

    m.top.content = content
end sub
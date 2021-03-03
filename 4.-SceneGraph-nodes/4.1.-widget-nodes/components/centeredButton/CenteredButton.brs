sub init()
    for i = 0 to m.top.getChildCount() - 1
        child = m.top.getChild(i)
        if child.subtype() = "Label"
            child.horizAlign = "center"
            child.observeField("horizAlign", "onHorizAlignChanged")
            exit for
        end if
    end for
end sub

sub onHorizAlignChanged(msg as Object)
    label = msg.getRoSGNode()
    if label.horizAlign <> "center"
        label.horizAlign = "center"
    end if
end sub
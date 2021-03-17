sub init()
    m.labelList = m.top.findNode("labelList")
    m.rowList = m.top.findNode("rowList")
    
    setObservers()

    m.rowlist.content = CreateObject("roSGNode","RowListContent")

    m.labelList.setFocus(true)
end sub

sub setObservers()
end sub

function onKeyEvent(key as String, press as Boolean) as Boolean
    if press
        if key="up"
            
        else if key="right"
            m.rowList.setFocus(true)
        else if key="down"

        else if key="left"
            m.labelList.setFocus(true)
        end if
    end if
    return true
end function
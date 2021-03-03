sub init()
    m.keyboard = m.top.findNode("searchKeyboard")
    m.textBox = m.top.findNode("searchTextBox")
    m.button = m.top.findNode("searchButton")
    m.label = m.top.findNode("searchTermLabel")

    ' Setup keyboard
    m.keyboard.setFields({
        showTextEditBox: false
        textEditBox: m.textBox
    })

    setObservers()

    m.keyboard.setFocus(true)
end sub

sub setObservers()
    m.button.observeField("buttonSelected", "onSearchButtonSelected")
    m.keyboard.observeField("text", "onKeyboardTextChange")
end sub

sub onKeyboardTextChange(message as object)
    m.textBox.text = message.getData()
end sub

sub onSearchButtonSelected()
    m.label.text = "Searched for: " + m.keyboard.text
end sub

function onKeyEvent(key as String, press as Boolean) as Boolean
    if press
        if key="down"
            m.button.setFocus(true)
        else if key="up"
            m.keyboard.setFocus(true)
        end if
    end if
    return true
end function
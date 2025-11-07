from greenlet import greenlet

def test1():
    print("[gr1] main  -> test1")
    gr2.switch()
    print("[gr1] test1 <- test2")
    gr2.switch()
    print("[gr1] test1 <- test2")
    
    # return 'test1 done'
    # main.switch()

def test2():
    print("[gr2] test1 -> test2")
    gr1.switch()
    print("[gr2] test1 -> test2")
    gr1.switch()
    print("This is never printed.")

gr1 = greenlet(test1)
gr2 = greenlet(test2)

gr1.switch()
print("[main] main <- test1")
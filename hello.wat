(module
  ;; Import the console.log function from JavaScript
  (import "console" "log" (func $log (param i32 i32)))
  
  ;; Memory to store our string
  (memory (export "memory") 1)
  
  ;; Data section with "Hello, World!" string
  (data (i32.const 0) "Hello, World!")
  
  ;; Export function that calls console.log with our string
  (func (export "sayHello")
    ;; Call console.log with pointer to string (0) and length (13)
    i32.const 0    ;; pointer to start of string
    i32.const 13   ;; length of "Hello, World!"
    call $log
  )
)

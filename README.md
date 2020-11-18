# cqh-go-util README


## 功能

### left_variable_apply(alt+k l)

把 `=` 左边的内容，赋值到等号右边


* `a, d = d => a, b = d[a], d[b]`

* `a,b = c => a, b = c.a, c.b`

* `a, b = q_ => a, b = q_a, q_b`

* `a, b = q(" => a, b = q("a"), q("n")`

* `a, b = q(' => a, b = q('a'), q('n')`

* `a, b = q( => a, b = q(a), q(b)`

* `a, b = .c() => a, b = a.c(), b.c()`


### last_line_var (alt+v l)


### var_prefix(alt+v p)

### var_suffix(alt+v s)

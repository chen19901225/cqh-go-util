# cqh-go-util README


## 功能

### left_variable_apply(alt+k a)

把 `=` 左边的内容，赋值到等号右边


* `a, d = d => a, b = d[a], d[b]`

* `a,b = c => a, b = c.a, c.b`

* `a, b = q_ => a, b = q_a, q_b`

* `a, b = q(" => a, b = q("a"), q("n")`

* `a, b = q(' => a, b = q('a'), q('n')`

* `a, b = q( => a, b = q(a), q(b)`

* `a, b = .c() => a, b = a.c(), b.c()`


### last_line_var (alt+v l)

* `a, b := ` => `a, b`


### var_prefix(alt+v p)


### var_suffix(alt+v s)

### get_left_var(alt+v g)

* `a :=` => `a`

* `a =` => `a`

* `a :` => `a`


### handle_var(alt+v h)


* `raw`:  'a' => 'a'

* `dict_get_var`:  'a["test"]' => 'a'

* `dict_get_key`: 'a["test"]' => '"test"'

* `dict_key_unquote`: 'a["test"]' => 'test'


* `var_simple`: aes => a, as => a

* `var_last_part`: a.b.c => c

* `var_remove_private`: _test => test

* `var_remove_prefix`: test__oter => oter

* `var_remove_last_part`: a.b.c => a.b

* `var_last_part_and_remove_private`: self._test => test

* `var_last_part_and_remove_prefix`: self.test__name => name



    



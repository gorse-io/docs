---
icon: sort
---
# Ranking

### Factorization Machines

User labels and item labels are important information for personalized recommendations, but matrix factorization only handles user embedding and item embedding. Factorization machines^3 generate recommendations with rich features such as user features and item features.

Different from the learning algorithms for matrix factorization, negative feedbacks are used in factorization machine training. The training dataset is constructed by

$$
D=\{((x_1,\dots,x_f,\dots,x_F),1)|(u,i)\in R\}\cup\{((x_1,\dots,x_f,\dots,x_F),0)|(u,i)\in\not R\}
$$

The dimension of input vectors $\mathbf{x}$ is the sum of the numbers of items, users, item labels and user labels: $F = |I| + |U| + |L_I| + |L_U|$. Each element in $\mathbf{x}$ for a pair $(u,i)$ is defined by

$$
x_f=\begin{cases}
\mathbb{I}(f=u)&0<f\le |I|\\
\mathbb{I}(f-|I|=u)&|I|<f\le |I|+|U|\\
\mathbb{I}(f-|I|-|U|\in L_i)&|I|+|U|<f<\le |I|+|U|+|L_I|\\
\mathbb{I}(f-|I|-|U|-|L_U| \in L_u)&|I|+|U|+|L_I|<f<\le F
\end{cases}
$$

The prediction output for a input vector $\mathbf{x}$ is

$$
\hat y = w_0 + \sum^n_{i=1}w_i x_i + \sum^n_{i=1}\sum^n_{j=i+1}\left<\mathbf{v}_i,\mathbf{v}_j\right>x_i x_j
$$

where the model parameters that have to be estimated are: $w_0\in\mathbb{R}$, $\mathbf{w}\in\mathbb{R}^n$, $\mathbf{V}\in\mathbb{R}^{n\times k}$. And $\left<\cdot,\cdot\right>$ is the dot product of two vectors. Parameters are optimized by logit loss with SGD. The loss function is

$$
\mathcal C=\sum_{(\mathbf{x},y)\in D}−y\log(\hat y)−(1−y)\log(1-\hat y)
$$

The gradient for each parameter is

$$
\frac{\partial}{\partial\theta}\hat y=\begin{cases}
1,&\text{if }\theta\text{ is }w_0\\
x_i,&\text{if }\theta\text{ is }w_i\\
x_i\sum^n_{j=1}v_{j,f}x_j-v_{i,f}x^2_i,&\text{if }\theta\text{ is }v_{i,f}
\end{cases}
$$

Hyper-parameters are optimized by random search and the configuration `recommend.collaborative` is reused.

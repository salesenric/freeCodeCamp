import numpy as np

def calculate(list):

    if len(list) < 9:
        raise ValueError('List must contain nine numbers.')

    array_3x3 = np.reshape(list, (3, 3))

    calculations = {
        'mean': [
            np.mean(array_3x3, axis=0).tolist(),
            np.mean(array_3x3, axis=1).tolist(),
            np.mean(array_3x3)
        ],
        'variance': [
            np.var(array_3x3, axis=0).tolist(),
            np.var(array_3x3, axis=1).tolist(),
            np.var(array_3x3)
        ],
        'standard deviation': [
            np.std(array_3x3, axis=0).tolist(),
            np.std(array_3x3, axis=1).tolist(),
            np.std(array_3x3)
        ],
        'max': [
            np.max(array_3x3, axis=0).tolist(),
            np.max(array_3x3, axis=1).tolist(),
            np.max(array_3x3)
        ],
        'min': [
            np.min(array_3x3, axis=0).tolist(),
            np.min(array_3x3, axis=1).tolist(),
            np.min(array_3x3)
        ],
        'sum': [
            np.sum(array_3x3, axis=0).tolist(),
            np.sum(array_3x3, axis=1).tolist(),
            np.sum(array_3x3)
        ]
    }

    return calculations
